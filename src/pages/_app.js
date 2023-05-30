import React from 'react';
import ReactDOM from 'react-dom';

import 'cleave.js/dist/addons/cleave-phone.in';
import '@/assets/globals.scss';
import '@/assets/scss/jquery-jvectormap.scss';
import '@/assets/scss/themes.scss';
import 'quill/dist/quill.snow.css';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-flip';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'react-dual-listbox/lib/react-dual-listbox.css';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

export default function App({ Component, pageProps }) {
	return <Component {...pageProps} />;
	
}
