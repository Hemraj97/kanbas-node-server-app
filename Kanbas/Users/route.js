import * as dao from "./dao.js";


export default function UserRoutes(app) {
  const createUser = async (req, res) => {
    try {
      const user = await dao.createUser(req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  const findAllUsers = async (req, res) => {
    const { role } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
    return;
  };

  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const status = await dao.updateUser(userId, req.body);
    globalCurrentUser = await dao.findUserById(userId);
    res.json(status);
  };

  const signup = async (req, res) => {
    console.log("Inside Router signup");
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const currentUser = await dao.createUser(req.body);
    console.log("Current User "+currentUser);
    req.session["currentUser"] = currentUser;
    // globalCurrentUser = currentUser;

    return res.json(currentUser);
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;

    const currentUser = await dao.findUserByCredentials(username, password);
    console.log("Current User"+currentUser);
    if (currentUser) {
      req.session.currentUser = currentUser;
    //   globalCurrentUser = currentUser;
      return res.json(currentUser);
    }

    return res.sendStatus(401);
  };

  const signout = (req, res) => {
    // globalCurrentUser = null;
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = async (req, res) => {
    console.log("Hello inside Router Profile")
    console.log(req.session.currentUser);
    let currentUser = req.session["currentUser"];
    // let currentUser = globalCurrentUser;
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}