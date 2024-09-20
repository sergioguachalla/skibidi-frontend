export interface UserClient {
    clientId: number;
    username: string;
  }

export interface UserResponse {
    data: UserClient[];
    message: string;
    successful: boolean;
}
