export type CommonLayoutParamsType = Readonly<{
  children: React.ReactNode
}>

export type ExtendableLayoutParamsType<T> = CommonLayoutParamsType & T

export type MethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export type BaseEndpointType = {
  name: string;
  slug: string;
  calls: {
    method: MethodType
    slug: string
  }[]
}

export type EndpointDetailType = {
  name: string;
  description: string;
  slug: string;
  calls: {
    is_error: boolean;
    method: MethodType
    response_code: number;
    slug: string
  }[]
}

export type CallDetailType = {
  method: MethodType;
  slug: string;
  response_code: number;
  is_error: boolean;
  error_message: string | null;
  response: Record<string, any> | null;
  endpoint: { slug: string }
}

export type AllEndpointResponse = BaseEndpointType[]