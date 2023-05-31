import styles from "./styles.module.css";

function About() {
	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>About us</h1>
			<div className={styles.form_container}>
				<div className={styles.left}>
				<img className={styles.img} src="./images/Bubbles.png" alt="about" />
				</div>
				<div className={styles.right}>
					<p className={styles.text}>
					Hook You! is a software developped to analyze emails and spot those which are malicious.
						Hook You! is a scholar project realized by one student.
					</p>
				</div>
			</div>
		</div>
	);
}

export default About;