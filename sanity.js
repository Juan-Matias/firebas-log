import { createClient } from '@sanity/client';  // Usa createClient en lugar de SanityClient
import imageBuilder from '@sanity/image-url';

const cliente = createClient({  // Usa createClient para crear la instancia del cliente
    projectId: '85f3kq4l',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2023-05-03',
});

const builder = imageBuilder(cliente);

export const urlFor = source => builder.image(source);

export default cliente;
