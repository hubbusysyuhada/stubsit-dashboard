export type CommonLayoutParamsType = Readonly<{
  children: React.ReactNode
}>

export type ExtendableLayoutParamsType<T> = CommonLayoutParamsType & T

export type MethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export type BaseEndpointType = {
  name: string;
  slug: string;
  calls: {
    is_error: boolean;
    method: MethodType
    response_code: number;
    slug: string
  }[]
}

export type AllEndpointResponse = BaseEndpointType[]