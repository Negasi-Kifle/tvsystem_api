import { z } from 'zod';
import { createShowHostDto } from './create-show-host.dto';


export const assignManyHostsToShowDto = z.object({
  showId: z.string('Show ID is required'),
  hosts: z.array(createShowHostDto.omit({ showId: true })).refine(
    (hosts) => new Set(hosts.map((host) => host.userId)).size === hosts.length,
    {
      message: 'Duplicate host userId is not allowed',
      path: ['hosts'],
    }
  )
    .refine(
      (hosts) => hosts.filter((host) => host.isPrimary === true).length <= 1,
      {
        message: 'Only one primary host is allowed',
        path: ['hosts'],
      }
    )
}).strict()

export type AssignManyHostsToShowDto = z.infer<typeof assignManyHostsToShowDto>;

