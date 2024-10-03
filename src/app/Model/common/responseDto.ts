export interface ResponseDto <T>{
    data: any | any[] | null;
    message: string | null;
    successful: boolean;
}
