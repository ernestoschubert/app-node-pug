import User from "./User.js";
import Price from "./Price.js";
import Category from "./Category.js";
import Property from "./Property.js";
import Message from "./Message.js";

Property.belongsTo(User, { foreignKey: 'userId' });
Property.belongsTo(Category, { foreignKey: 'categoryId' });
Property.belongsTo(Price, { foreignKey: 'priceId' });

Property.hasMany(Message, { foreignKey: 'propertyId' });

Message.belongsTo(Property, { foreignKey: 'propertyId' });
Message.belongsTo(User, { foreignKey: 'userId' });

export {
    User,
    Property,
    Price,
    Category,
    Message,
}