var faker = require('faker');

module.exports.generate = function(max){
	var profiles = [],
		users 	 = [];

	for(var i=0;i<max;i++) {
		var fname = faker.name.firstName();
		var lname = faker.name.lastName();

		var user = {
			id: faker.random.uuid(),
			username: faker.internet.email(), 
			password: faker.internet.password()
		};
		var profile = {
			id: user.id, 
			username: user.username,
			name: fname + " " + lname,
			fist_name: fname, 
			last_name: lname,
			middle_name: "",
			gender: faker.random.arrayElement(["male","female"]),
			email: user.username, 
			link: faker.internet.url()
		};

		users.push(user);
		profiles.push(profile);
	}
	return {users, profiles};
}