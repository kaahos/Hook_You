const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: "/auth/google/callback",
			access_type: 'offline',
			scope: ["profile", "email", "https://mail.google.com/"],
		},
		function (accessToken, refreshToken, profile, callback) {
			callback(null, {profile, accessToken});
		}
	)
);

passport.serializeUser((user, done) => {
	const serializedUser = {
		profile: user.profile,
		accessToken: user.accessToken,
	  };
	  
	  done(null, serializedUser);
});

	passport.deserializeUser((user, done) => {
	const userProfile = user.profile;
	const accessToken = user.accessToken;
	
	done(null, user);
});
