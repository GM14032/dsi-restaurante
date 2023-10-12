import { useRef } from 'react';

const useDebounce = () => {
	const timeoutHandlerDebounce = useRef();

	const debounce = (callback = () => {}, wait = 1000) => {
		timeoutHandlerDebounce.current &&
			clearTimeout(timeoutHandlerDebounce.current);
		timeoutHandlerDebounce.current = setTimeout(() => {
			callback();
			timeoutHandlerDebounce.current = undefined;
		}, wait);
	};
	return { debounce };
};

export default useDebounce;
