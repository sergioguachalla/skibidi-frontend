export interface UserClient {
    clientId: number;
    username: string;
    kcUuid: string;
  }

export interface UserResponse {
    data: UserClient[];
    message: string;
    successful: boolean;
}
