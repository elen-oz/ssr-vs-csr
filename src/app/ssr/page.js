import Content from '@/components/content';
import { API_KEY } from '@/constants';
import styles from '../page.module.css';
import SSRReload from '@/components/ssrReload';
import { imageUrlToBase64 } from '@/helpers';

async function getData() {
  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=1&thumbs=true`,
    { cache: 'no-cache' }
  );

  let errorText = '';

  if (!response.ok) {
    errorText = `${response.status} ${response.statusText}`;
    throw new Error('Failed to fetch data');
  }

  const [json] = await response.json();
  const imgUrl = json.url;
  console.log('imgUrl:', imgUrl);

  const imgData = await imageUrlToBase64(imgUrl);
  return { data: json, img: imgData, error: errorText };
}

export default async function SSR() {
  const { data, img, error } = await getData();

  return (
    <main className={styles.main}>
      <div className={styles.title}>SERVER-SIDE RENDERED</div>
      <SSRReload />
      {error && <p style={{ color: '#ff0000' }}>Error occurred: {errorText}</p>}
      {data ? <Content data={data} img={img} /> : <div>Loading...</div>}
    </main>
  );
}
