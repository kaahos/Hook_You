import styles from "./styles.module.css";

function Login() {
	const googleAuth = () => {
		window.open(
			`${process.env.REACT_APP_API_URL}/auth/google/callback`,
			"_self"
		);
	};
	return (
		<div className={styles.container2}>
			<h1 className={styles.heading}>Hook You!</h1>
			<div className={styles.form_container}>
				<div className={styles.left}>
					<img className={styles.img} src="./images/hook_you_logo_beta.png" alt="login" />
				</div>
				<div className={styles.right}>
					<h2 className={styles.from_heading}>Log in to start</h2>
					<button className={styles.google_btn} onClick={googleAuth}>
						<img src="./images/google.png" alt="google icon" />
						<span>Sign in with Google</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default Login;
