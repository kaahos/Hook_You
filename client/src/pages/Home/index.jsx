import styles from "./styles.module.css";

function Home() {
	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>Hook You!</h1>
			<div className={styles.form_container}>
				<div className={styles.left}>
				<img className={styles.img2} src="./images/Bubbles.png" alt="about" />
					<p className={styles.text}>
						Simple, easy and free, <br/>
						Hook You! is a straight forward solution to improve your security.
					</p>			
				</div>
				<div className={styles.right}>
				<img className={styles.img} src="./images/hook_you_logo_beta.png" alt="home" />
				</div>
			</div>
		</div>
	);
}

export default Home;