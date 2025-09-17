// TODO: Add logic to request verification code, submit code + new email, and mark user as unverified until confirmed
const EmailUpdateSection = () => {
  return (
    <section>
      <h3>Update Email (Verification Required)</h3>
      <form>
        <input name="newEmail" placeholder="New email" />
        <button type="button">Request Code</button>
        <input name="code" placeholder="Verification code" />
        <button type="button">Confirm</button>
      </form>
    </section>
  );
};

export default EmailUpdateSection;
