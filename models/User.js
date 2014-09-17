function User(user) {
    this.id = user.ID;
    this.name = user.NAME;
    this.group = user.GROUP;
    this.active =  (user.STATUS ==1) ? true:false;
    this.loading = false;
    this.isHide = false;
}
module.exports = User;