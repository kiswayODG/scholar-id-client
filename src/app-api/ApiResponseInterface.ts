export interface ApiResponseInterface<T>{
    message: string,
    status: number,
    data: T[] | T | T[][]
}