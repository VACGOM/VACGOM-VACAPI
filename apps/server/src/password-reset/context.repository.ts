import { PasswordResetContext } from './password-reset.context';

export interface ContextRepository {
  save(context: PasswordResetContext): Promise<void>;

  getByUserId(userId: string): Promise<PasswordResetContext | null>;
}
