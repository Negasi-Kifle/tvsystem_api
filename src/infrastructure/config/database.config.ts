import mongoose from 'mongoose';

export async function connectDatabase(uri: string): Promise<typeof mongoose> {
  return mongoose.connect(uri);
}
