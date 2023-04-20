import { z } from 'zod';
import { EventCreateDTOSchema } from './modelSchema';

export type IEventCreateDTO = z.infer<typeof EventCreateDTOSchema>

