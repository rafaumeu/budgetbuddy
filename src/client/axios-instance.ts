import Axios from 'axios'

export const axiosInstance = Axios.create({
  baseURL: 'http://localhost:3333',
})

export function customInstance<T>(
  config: Parameters<typeof axiosInstance>[0],
): Promise<T> {
  return axiosInstance(config).then(({ data }) => data)
}
