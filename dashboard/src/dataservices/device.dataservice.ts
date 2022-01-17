import { END_POINT } from '../constants';
import { ApiHelper } from '../helpers/api.helper';

export const DeviceDataservice = {
    GetList: async (token: string, page: number, limit: number) => {
        const api = `${END_POINT.API}${END_POINT.DEVICES}?page=${page}&limit=${limit}`;
        const resp: any = await ApiHelper.SendRequestWithToken(
            api,
            {
                token,
                page,
                limit,
            },
            'GET'
        );
        return resp.data;
    },
    GetOne: async (token: string, id: number) => {
        let api = `${END_POINT.API}${END_POINT.DEVICE}`;

        api = api.replace(':id', id.toString());
        const resp: any = await ApiHelper.SendRequestWithToken(
            api,
            {
                token,
            },
            'GET'
        );
        return resp.data;
    },
};
