import cliente from '../../sanity.js';  // Asegúrate de que la ruta sea correcta

const sanityQuery = (query, params) => cliente.fetch(query, params);

export const getFeaturedRestaurants = () => {
    return sanityQuery(`
        *[_type == 'featured']{
            ...,
            restaurants[]->{
                ...,
                dishes[]->{
                    ...
                },
                type->{
                    name
                }
            }
        }
    `);
}

export const getCategories = () => {
    return sanityQuery(`
        *[_type == 'category']{
            ...
        }
    `);
}

export const getEvento = async () => {
    try {
        const data = await sanityQuery(`
            *[_type == 'eventos']{
                _id,
                name,
                description,
                image
            }
        `);
        //console.log("Data fetched from Sanity:", data); // Deberías ver los datos aquí
        return data;
    } catch (error) {
        //console.error("Error fetching eventos:", error);
        return [];
    }
}

export const getFeaturedRestaurantsById = id => {
    return sanityQuery(`
        *[_type == 'featured' && _id == $id]{
            ...,
            restaurants[]->{
                ...,
                dishes[]->{
                    ...
                },
                type->{
                    name
                }
            }
        }[0]
    `, { id });
}
