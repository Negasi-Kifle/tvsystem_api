import { streamText, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import type { LanguageModel } from 'ai';
import type { AnalyticsService } from './analytics.service.js';
import { currentYearMonthLocal } from './analytics.service.js';
import type { IAdvertPlacementRepository } from '../../domain/repositories/advert-placement.repository.interface.js';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository.interface.js';
import type { IEmployeeRepository } from '../../domain/repositories/employee.repo.js';
import type { AdvertPackageRevenueChartPayload } from '../../domain/interfaces/insight-chart.interface.js';
import type { ICustomerRepository } from '../../domain/repositories/customer.repository.interface.js';
import type { IShowRepository } from '../../domain/repositories/show.repository.interface.js';
import type { ICategoryRepository } from '../../domain/repositories/category.repository.interface.js';
import type { ISubCategoryRepository } from '../../domain/repositories/sub-category.repository.interface.js';

export class InsightService {
  constructor(
    private readonly model: LanguageModel,
    private readonly analyticsService: AnalyticsService,
    private readonly advertPlacementRepo: IAdvertPlacementRepository,
    private readonly paymentRepo: IPaymentRepository,
    private readonly employeeRepo: IEmployeeRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly showRepo: IShowRepository,
  ) { }

  // Return type intentionally inferred — streamText result type is complex and version-specific
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  query(question: string) {
    const today = new Date().toISOString().split('T')[0];

    const system = `You are a business intelligence assistant for Abbay TV, an Ethiopian television network.
                    You help admins understand operational and financial performance through natural language questions.
                    Today's date is ${today}. All monetary values are in ETB (Ethiopian Birr).

                    Always call the relevant tool(s) to fetch live data before answering.
                    Be concise and business-focused. Format numbers clearly (e.g. ETB 142,300).
                    If a question requires data not covered by the available tools, say so clearly.

                    When the user asks to compare revenue by advert package for a month,
                    or wants a bar chart, pie chart, or line chart of that metric,
                    call getRevenueByAdvertPackageChart with the appropriate chartType (bar, pie, or line) and
                    optional month (YYYY-MM). Omit month for the current calendar month.
                    The tool returns structured series data for the client to render as a chart;
                    summarize the same numbers briefly in your reply.`;

    return streamText({
      model: this.model,
      system,
      prompt: question,
      stopWhen: stepCountIs(8),
      tools: {

        getKpiSummary: tool({
          description:
            `Get current-month KPI summary: total revenue, active shows, active ads, 
              total customers, conversion rate, and active leads — each with month-over-month 
              percentage change. Today's date is ${today}.`,
          inputSchema: z.object({}),
          execute: async () => this.analyticsService.getKpiSummary(),
        }),

        getMonthlyRevenue: tool({
          description:
            'Get monthly revenue breakdown for a given year (12 items: month, revenue, target).',
          inputSchema: z.object({
            year: z.number().int().min(2020).max(2100).describe('The 4-digit year, e.g. 2026'),
          }),
          execute: async (input) => this.analyticsService.getMonthlyRevenueSummary(input.year),
        }),

        getTopShowsByRevenue: tool({
          description:
            'Get top N shows ranked by total paid revenue, including show title, type, revenue, target, and active ad count.',
          inputSchema: z.object({
            limit: z
              .number()
              .int()
              .min(1)
              .max(50)
              .default(10)
              .describe('How many shows to return (default 10)'),
          }),
          execute: async (input) => this.analyticsService.getTopShowsByRevenue(input.limit),
        }),

        getAdsEndingSoon: tool({
          description:
            'Get scheduled ad placements that will go off-air within the next N hours. Use 24 for "today", 48 for "today or tomorrow".',
          inputSchema: z.object({
            withinHours: z
              .number()
              .int()
              .min(1)
              .max(168)
              .describe('Look-ahead window in hours (e.g. 24 = ending within 24 h)'),
          }),
          execute: async (input) => {
            const now = new Date();
            const windowEnd = new Date(now.getTime() + input.withinHours * 60 * 60 * 1000);
            const placements = await this.advertPlacementRepo.findPlacementsNeedingAirAlert(
              now,
              windowEnd,
            );
            return placements.map((p) => ({
              id: p.id,
              showId: p.showId,
              date: p.date,
              dateEth: p.dateEth,
              status: p.status,
              broadcastCode: p.broadcastCode,
            }));
          },
        }),

        getWeeklyRevenueSummary: tool({
          description:
            'Compare paid revenue for the current calendar week (Mon–Sun) vs the previous week, including percentage change.',
          inputSchema: z.object({}),
          execute: async () => this.paymentRepo.getWeeklyRevenueSummary(),
        }),

        getActiveEmployeesCount: tool({
          description: 'Get the total number of currently active employees.',
          inputSchema: z.object({}),
          execute: async () => {
            const count = await this.employeeRepo.countActive();
            return { activeEmployees: count };
          },
        }),

        getRevenueByAdvertPackageChart: tool({
          description:
            `Paid revenue (bank deposits) grouped by advert package for a calendar month, structured for charts. 
              Use when the user compares package revenue for a month or asks for a bar/pie/line chart of revenue by package.
              Values are server-computed; choose chartType to match the user (bar for comparisons, pie for share of total, line is available for consistency).
              Today's date is ${today}.`,
          inputSchema: z.object({
            chartType: z
              .enum(['bar', 'pie', 'line'])
              .describe('Visualization form: bar for comparing packages, pie for proportions, line if the user asks for a line chart.'),
            month: z
              .string()
              .regex(/^\d{4}-\d{2}$/)
              .optional()
              .describe(`Calendar month YYYY-MM; omit for the current month (server local date).
                Today's date is ${today}.`),
          }),
          execute: async (input): Promise<AdvertPackageRevenueChartPayload> => {
            const ym = input.month ?? currentYearMonthLocal();
            const rows = await this.analyticsService.getRevenueByAdvertPackageForMonth(input.month);
            const points = rows.map((r) => ({
              label: r.packageName,
              value: r.revenue,
            }));
            return {
              chartType: input.chartType,
              title: `Paid revenue by advert package (${ym})`,
              valueUnit: 'ETB',
              month: ym,
              points,
            };
          },
        }),

        getAllCustomers: tool({
          description: 'Get all customers.',
          inputSchema: z.object({}),
          execute: async () => this.customerRepo.findMany({}),
        }),

        getAllShows: tool({
          description: 'Get all shows.',
          inputSchema: z.object({}),
          execute: async () => this.showRepo.findMany({}),
        }),
      },
    });
  }
}
