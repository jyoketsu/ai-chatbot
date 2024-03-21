print(
  `Start ################################################################# ${process.env.MONGO_APP_USER}:${process.env.MONGO_APP_PASSWORD}@${process.env.MONGO_APP_DATABASE}`
);
// db.getSiblingDB("admin").auth(
//   process.env.MONGO_INITDB_ROOT_USERNAME,
//   process.env.MONGO_INITDB_ROOT_PASSWORD
// );
db.createUser({
  user: process.env.MONGO_APP_USER,
  pwd: process.env.MONGO_APP_PASSWORD,
  roles: [{ role: "readWrite", db: process.env.MONGO_INITDB_DATABASE }],
});

db.print(
  "END #################################################################"
);
