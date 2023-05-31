import styles from "./styles.module.css";

function Profile(userDetails) {
  const user = userDetails.user.user;
  const logout = () => {
    localStorage.removeItem("fetchedData");
    window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
  };
  const analyse = (param) => {
    console.log("Param:", param);
    window.open(`/analyse`, "_self");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Hook You!</h1>
      <div className={styles.form_container}>
        <div className={styles.left}>
          <img className={styles.img} src="./images/hook_you_logo_beta.png" alt="profile" />
        </div>
        <div className={styles.right}>
          <h2 className={styles.from_heading}>Your Info</h2>
          <img
            src={user.picture}
            alt="profile"
            className={styles.profile_img}
          />
          <input
            type="text"
            defaultValue={user.name}
            className={styles.input}
            placeholder="UserName"
            readOnly="readonly"
          />
          <input
            type="text"
            defaultValue={user.email}
            className={styles.input}
            placeholder="Email"
            readOnly="readonly"
          />
          <button className={styles.btn_logout} onClick={logout}>
            Log Out
          </button>
          <button className={styles.btn_analyze} onClick={() => analyse(userDetails.user.accessToken)}>
            Analyse
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
