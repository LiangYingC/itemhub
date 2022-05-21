import {
    useCreateOauthClientRedirectUris,
    useDeleteOauthClientRedirectUris,
    useGetOauthClientRedirectUris,
} from '@/hooks/apis/oauth-client-redirect-uris.hook';
import { useAppSelector } from '@/hooks/redux.hook';
import { selectOauthClientRedirectUris } from '@/redux/reducers/oauth-client-redirect-uris.reducer';
import {
    toasterActions,
    ToasterTypeEnum,
} from '@/redux/reducers/toaster.reducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import TagsInput, { Tag } from '../inputs/tags-input/tags-input';

const OauthClientRedirectUri = (props: { oauthClientId: number | null }) => {
    const { oauthClientId } = props;

    const dispatch = useDispatch();

    const oauthClientRedirectUris = useAppSelector(
        selectOauthClientRedirectUris
    );

    const initialTags = oauthClientRedirectUris.map((redirectUri) => {
        return {
            id: redirectUri.id.toString(),
            text: redirectUri.uri,
        };
    });

    const [tags, setTags] = useState<Tag[]>(initialTags);

    const isNotChange =
        oauthClientRedirectUris
            .map((item) => item.uri)
            .sort()
            .join(',') ===
        tags
            .map((item) => item.text)
            .sort()
            .join(',');

    const [shouldBeAddedUris, setShouldBeAddedUris] = useState<string[]>([]);
    const [shouldBeDeletedIds, setShouldBeDeletedIds] = useState<number[]>([]);
    const isShowUpdateSuccessfully = useRef(true);

    const {
        fetchApi: getOauthClientRedirectUris,
        data: responseOfRedirectUris,
    } = useGetOauthClientRedirectUris(oauthClientId || 0);

    const {
        fetchApi: createOauthClientRedirectUris,
        data: responseOfCreateRedirectUris,
    } = useCreateOauthClientRedirectUris({
        oauthClientId: oauthClientId || 0,
        uris: shouldBeAddedUris,
    });

    const {
        fetchApi: deleteOauthClientRedirectUris,
        data: responseOfDeleteRedirectUris,
    } = useDeleteOauthClientRedirectUris({
        oauthClientId: oauthClientId || 0,
        ids: shouldBeDeletedIds,
    });

    useEffect(() => {
        if (!oauthClientRedirectUris) {
            return;
        }
        getOauthClientRedirectUris();
    }, []);

    useEffect(() => {
        if (!responseOfRedirectUris) {
            return;
        }
        const newTags = responseOfRedirectUris.map<Tag>((item) => {
            return {
                id: item.id.toString(),
                text: item.uri,
            };
        });
        setTags(newTags);
    }, [responseOfRedirectUris]);

    useEffect(() => {
        if (!shouldBeAddedUris || shouldBeAddedUris.length === 0) {
            return;
        }
        createOauthClientRedirectUris();
    }, [shouldBeAddedUris]);

    useEffect(() => {
        if (!shouldBeDeletedIds || shouldBeDeletedIds.length === 0) {
            return;
        }
        deleteOauthClientRedirectUris();
    }, [shouldBeDeletedIds]);

    useEffect(() => {
        if (!isShowUpdateSuccessfully.current) {
            return;
        }

        if (responseOfDeleteRedirectUris || responseOfCreateRedirectUris) {
            dispatch(
                toasterActions.pushOne({
                    message: '更新成功',
                    duration: 5,
                    type: ToasterTypeEnum.INFO,
                })
            );
            isShowUpdateSuccessfully.current = false;
        }
    }, [responseOfDeleteRedirectUris, responseOfCreateRedirectUris]);

    const handleAddition = (tag: Tag) => {
        if (!tag.text.startsWith('https://')) {
            dispatch(
                toasterActions.pushOne({
                    message: '輸入的網址必須是 https:// 開頭',
                    duration: 10,
                    type: ToasterTypeEnum.ERROR,
                })
            );
            return;
        }

        const filterTags = tags.filter((item) => item.text === tag.text);
        if (filterTags.length > 0) {
            dispatch(
                toasterActions.pushOne({
                    message: '重複的網址',
                    duration: 10,
                    type: ToasterTypeEnum.ERROR,
                })
            );
            return;
        }
        setTags([...tags, tag]);
    };

    const handleDelete = (id: string) => {
        setTags(tags.filter((tag) => tag.id !== id));
    };

    const updateRedirectUris = () => {
        const uris = tags.map((tag) => tag.text);
        const shouldDeletedItemIds = oauthClientRedirectUris
            .filter((item) => {
                return uris.filter((uri) => uri === item.uri).length === 0;
            })
            .map((item) => item.id);

        const shouldAddedItems = uris.filter((uri) => {
            return (
                oauthClientRedirectUris.filter((item) => item.uri === uri)
                    .length === 0
            );
        });

        setShouldBeAddedUris(shouldAddedItems);
        setShouldBeDeletedIds(shouldDeletedItemIds);
        isShowUpdateSuccessfully.current = true;
    };

    const revertRedirectUris = () => {
        setShouldBeAddedUris([]);
        setShouldBeDeletedIds([]);
        setTags(initialTags);
    };

    return (
        <div className="oauth-client-redirect-uri card">
            <div className="p-4">
                <label className="w-100">
                    Redirect Uris
                    <div className="mt-2 form-control d-flex">
                        <TagsInput
                            tags={tags}
                            placeholder="請輸入授權網址"
                            handleDelete={handleDelete}
                            handleAddition={handleAddition}
                        />
                    </div>
                    <div className="text-sm text-grey-300">
                        輸入 uri 後，按下 enter 或是 tab，就能成功輸入一項 uri
                    </div>
                </label>

                <div className="d-flex justify-content-end mt-5 ">
                    <div className="d-flex">
                        <button
                            className="btn btn-warn ms-3"
                            disabled={isNotChange}
                            onClick={revertRedirectUris}
                        >
                            還原
                        </button>
                        <button
                            className="btn btn-primary ms-3"
                            disabled={isNotChange}
                            onClick={updateRedirectUris}
                        >
                            儲存
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OauthClientRedirectUri;
