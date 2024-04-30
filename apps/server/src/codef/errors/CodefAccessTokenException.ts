export class CodefAccessTokenException extends Error {
  constructor(readonly response: Response) {
    super();
  }
}
