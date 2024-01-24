import Product from "./product";

describe('Product', () => {
  it('should throw error when id is empty', () => {
    expect(() => new Product('', 'Product 123', 100)).toThrowError('Id is required');
  });

  it('should throw error when name is empty', () => {
    expect(() => new Product('123', '', 100)).toThrowError('Name is required');
  });

  it('should throw error when price is less than 0', () => {
    expect(() => new Product('123', 'Product 123', -1)).toThrowError('Price must be greater than 0');
  });

  it('should change name', () => {
    const product = new Product('123', 'Product 123', 100);
    product.changeName('Product 456');
    expect(product.name).toBe('Product 456');
  });

  it('should throw error when name is empty after change', () => {
    const product = new Product('123', 'Product 123', 100);
    expect(() => product.changeName('')).toThrowError('Name is required');
  });

  it('should change price', () => {
    const product = new Product('123', 'Product 123', 100);
    product.changePrice(200);
    expect(product.price).toBe(200);
  });
});