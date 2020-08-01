function toConvert(products) {
  const productList = products.map((product) => {
    return {
      id: product.id,
      name: product.name,
      path: product.path,
      price: product.prices.price,
    };
  });

  return productList;
}

module.exports.toConvert = toConvert;
