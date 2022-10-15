import User from "./User.js";
import Price from "./Price.js";
import Category from "./Category.js";
import Property from "./Property.js";

Property.belongsTo(User, { foreignKey: 'userId' });
Property.belongsTo(Category, { foreignKey: 'categoryId' });
Property.belongsTo(Price, { foreignKey: 'priceId' });

export {
    User,
    Property,
    Price,
    Category,
}