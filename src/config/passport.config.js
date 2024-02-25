import passport from "passport";
import githubStrategy from "passport-github2";
import UserManagerMongo from "../dao/Mongo/userManagerMongo.js";
import passportJWT from "passport-jwt";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import { private_key } from "../utils/jsonwebtoken.js";

const passportService = new UserManagerMongo();
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const initializePassport = () => {
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["cookieToken"];
    }
    return token;
  };

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: private_key,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // passport.use(
  //   "register",
  //   new   LocalStrategy(
  //     {
  //       passReqToCallback: true,
  //       usernameField: "email",
  //     },
  //     async (req, username, password, done) => {
  //       const { first_name, last_name, email } = req.body;
  //       try {
  //         let user = await passportService.getUserBy({ email: username });

  //         if (user) return done(null, false);

  //         let newUser = {
  //           first_name,
  //           last_name,
  //           email,
  //           password: createHash(password),
  //         };

  //         let result = await passportService.createUsers(newUser);

  //         return done(null, result);
  //       } catch (error) {
  //         return done(error);
  //       }
  //     }
  //   )
  // );

  // passport.use(
  //   "login",
  //   new LocalStrategy(
  //     {
  //       passReqToCallback: true,
  //       usernameField: "email",
  //     },
  //     async (req, username, password, done) => {
  //       try {
  //         const user = await passportService.getUserBy({ email: username });
  //         if (!user) {
  //           console.log("passport User not found");
  //           return done(null, false);
  //         }
  //         if (!isValidPassword(password, user.password))
  //           return done(null, false);
  //         return done(null, user);
  //       } catch (error) {
  //         return done(error);
  //       }
  //     }
  //   )
  // );

  
  passport.use(
    "github",
    new githubStrategy(
      {
      clientID: "Iv1.9071754b1431ddf8",
      clientSecret: "556ab87d82cae602a2c3d1a681119f61b8cc4864",
      callbackURL: "http://localhost:8080/api/sessions/githubcallback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("profile: ", profile);
      try {
        let user = await passportService.getUserBy({
          email: profile._json.email,
        });
        if (!user) {
          let newUser = {
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            password: "",
          };
          let result = await passportService.createUsers(newUser);
          return done(null, result);
        }
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
    )
    );
    
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
      let user = await passportService.getUserBy({ _id: id });
      done(null, user);
    });
  };
  
    export default initializePassport;
    