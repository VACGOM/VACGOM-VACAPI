import { PasswordResetContext } from './password-reset.context';

export interface ContextRepository {
  save(context: PasswordResetContext): Promise<void>;

  findByUserId(userId: string): Promise<PasswordResetContext | null>;
}
