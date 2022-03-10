function applyExtraSetup(sequelize) {
	const { ratings, orders, space_types, users, workspaces } = sequelize.models;

	// Add tables relations here 
	
	ratings.hasOne(users, {
        sourceKey: 'user_id',
        foreignKey: 'id'
    })

    ratings.hasOne(workspaces, {
        sourceKey: 'workspace_id',
        foreignKey: 'id'
    })

	orders.hasOne(users, {
        sourceKey: 'user_id',
        foreignKey: 'id'
    })

    orders.hasOne(workspaces, {
        sourceKey: 'workspace_id',
        foreignKey: 'id'
    })

	workspaces.hasOne(users, {
        sourceKey: 'host_id',
        foreignKey: 'id'
    })

    workspaces.hasOne(space_types, {
        sourceKey: 'space_type_id',
        foreignKey: 'id'
    })
 }

module.exports = { applyExtraSetup };