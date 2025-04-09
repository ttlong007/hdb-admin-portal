import { TypedUseSelectorHook, useSelector } from 'react-redux';
import type { RootState } from '.';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector;