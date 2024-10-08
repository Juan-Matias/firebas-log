import cliente from "../../sanity.js";

const sanityQuery = (query, params) => cliente.fetch(query, params);

export const getCategories = () => {
  return sanityQuery(`
        *[_type == 'category']{
            ...
        }
    `);
};

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
};

export const fetchProducts = async () => {
  const query = `*[_type == "product"]{
      _id,
      name,
      barrel,
      barrelPrice,
      price,
      description,
      image {
        asset -> {
          url
        }
      }
    }`;
  try {
    // Realiza la consulta y devuelve los datos
    const products = await cliente.fetch(query);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Propaga el error para que pueda ser manejado en otros lugares
  }
};

export const fetchProductsByCategory = async (categoryName) => {
  const query = `*[_type == "product" && description match $categoryName] {
  _id,
  name,
  barrel,
  barrelPrice,
  price,
  description
}`;
  try {
    const products = await cliente.fetch(query, { categoryName });
    if (!products || products.length === 0) {
      console.log(
        `No se encontraron productos para la categoría: ${categoryName}`
      );
    }
    return products;
  } catch (error) {
    console.error(
      `Error fetching products by category (${categoryName}):`,
      error
    );
    throw error;
  }
};
