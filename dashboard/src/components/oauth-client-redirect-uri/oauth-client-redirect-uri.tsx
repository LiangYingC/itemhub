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
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { WithContext as ReactTagInput, Tag } from 'react-tag-input';

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

    const [shouldBeAddedUris, setShouldBeAddedUris] = useState<string[]>([]);
    const [shouldBeDeletedIds, setShouldBeDeletedIds] = useState<number[]>([]);

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

    const handleDelete = (i: number) => {
        setTags(tags.filter((tag, index) => index !== i));
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
                        <ReactTagInput
                            handleDelete={handleDelete}
                            handleAddition={handleAddition}
                            tags={tags}
                            inputFieldPosition="bottom"
                            placeholder=""
                            classNames={{
                                tags: 'd-flex flex-wrap align-items-center my-n2',
                                tag: 'd-flex flex-nowrap align-items-center bg-grey-500 text-grey-400 bg-opacity-15 rounded-pill px-3 me-3 text-sm justify-content-between my-2 border-grey-800',
                                remove: 'tag-remvoe border-0 shadow-none ms-3 text-grey-500 text-opacity-25 mb-1',
                                selected: 'd-flex align-items-center flex-wrap',
                                tagInput: 'tag-input border-0 text-sm w-100',
                                tagInputField:
                                    'tag-input-field border-0 w-100 pb-3',
                            }}
                        />
                    </div>
                </label>

                <div className="d-flex justify-content-end mt-5 ">
                    <div className="d-flex">
                        <button
                            className="btn btn-warn ms-3"
                            disabled={
                                oauthClientRedirectUris
                                    .map((item) => item.uri)
                                    .sort()
                                    .join(',') ===
                                tags
                                    .map((item) => item.text)
                                    .sort()
                                    .join(',')
                            }
                            onClick={revertRedirectUris}
                        >
                            還原
                        </button>
                        <button
                            className="btn btn-primary ms-3"
                            disabled={
                                tags.length === 0 ||
                                oauthClientRedirectUris
                                    .map((item) => item.uri)
                                    .sort()
                                    .join(',') ===
                                    tags
                                        .map((item) => item.text)
                                        .sort()
                                        .join(',')
                            }
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
