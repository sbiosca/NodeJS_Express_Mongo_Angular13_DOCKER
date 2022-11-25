db.createUser(
    {
        user: "bioskin",
        pwd: "12345",
        roles: [
            {
                role: "readWrite",
                db: "bd_projects"
            }
        ]
    }
);