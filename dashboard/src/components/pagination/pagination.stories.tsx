/* eslint-disable */
import Pagination from './pagination';

export default {
    title: 'pagination',
};

export const Default = () => <Pagination rowNums={100} limit={5} page={1} />;

Default.story = {
    name: 'default',
};
