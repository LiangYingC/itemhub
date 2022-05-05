import { useCallback } from 'react';
import { useAppDispatch } from '@/hooks/redux.hook';
import { useFetchApi } from '@/hooks/apis/fetch.hook';
import { universalActions } from '@/redux/reducers/universal.reducer';
import { API_URL, END_POINT, HTTP_METHOD } from '@/constants/api';
import { TriggerOerator } from '@/types/universal.type';
import { FirmwareType } from '@/types/universal.type';

export const useGetTriggerOperatorsApi = () => {
    const dispatch = useAppDispatch();
    const dispatchSetTriggerOperators = useCallback(
        (data: TriggerOerator[]) => {
            if (data) {
                dispatch(universalActions.setTriggerOperators(data));
            }
        },
        [dispatch]
    );
    const apiPath = `${API_URL}${END_POINT.TRIGGER_OPERATORS}`;

    const { isLoading, error, fetchApi } = useFetchApi<TriggerOerator[]>({
        apiPath,
        method: HTTP_METHOD.GET,
        initialData: null,
        callbackFunc: dispatchSetTriggerOperators,
    });

    return {
        gettingTriggerOperators: isLoading,
        gettingTriggerOperatorsErr: error,
        getTriggerOperatorsApi: fetchApi,
    };
};

export const useGetFirmwareTypesApi = () => {
    const dispatch = useAppDispatch();
    const dispatchSetFirmwareTypes = useCallback(
        (data: FirmwareType[]) => {
            if (data) {
                dispatch(universalActions.setFirmwareTypes(data));
            }
        },
        [dispatch]
    );

    const apiPath = `${API_URL}${END_POINT.FIRMWARE_TYPES}`;

    const { isLoading, error, fetchApi } = useFetchApi<FirmwareType[]>({
        apiPath,
        method: HTTP_METHOD.GET,
        initialData: null,
        callbackFunc: dispatchSetFirmwareTypes,
    });

    return {
        gettingFirmwareTypes: isLoading,
        gettingFirmwareTypesErr: error,
        getFirmwareTypesApi: fetchApi,
    };
};
