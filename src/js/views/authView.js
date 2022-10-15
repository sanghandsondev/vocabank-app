
class AuthMarkup {
    optionLoginMarkup() {
        return `
    <div class="js-login-options">
        <h3 class="mb-3">Lựa chọn đăng nhập</h3>
        <button type="button" class="btn btn-outline-secondary btn-block js-btn-login-email">Đăng nhập với
            email</button>
        <button type="button" class="btn btn-outline-primary btn-block js-btn-login-facebook">Đăng nhập với
            Facebook</button>
        <button type="button" class="btn btn-outline-danger btn-block js-btn-login-google">Đăng nhập với
            Google</button>
        <p class="text-secondary mt-3">Bạn chưa có tài khoản?
            <a href="#" class=" text-dark js-signup">Đăng ký ngay</a>
        </p>
    </div>
    `
    }

    formLoginWithEmailMarkup() {
        return `
    <form class="js-form-login">
        <h3 class="mb-3">Đăng nhập</h3>
        <div class="form-group">
            <label for="inputLoginEmail">Email</label>
            <input type="text" class="form-control" id="inputLoginEmail"
                aria-describedby="inputLoginEmailHelp" placeholder="Địa chỉ email..."
                autocomplete="off">
            <div class="invalid-feedback">
                Trường này phải nhập một email.
            </div>
        </div>
        <div class="form-group">
            <label for="inputLoginPassWord">Mật khẩu</label>
            <input type="password" class="form-control" id="inputLoginPassWord"
                placeholder="Mật khẩu..." autocomplete="off">
            <div class="invalid-feedback">
                Mật khẩu cần ít nhất 6 ký tự.
            </div>
        </div>
        <p class="text-secondary">Quên mật khẩu?
            <a href="#" class="text-dark js-forgot-password">Click here</a>
        </p>
        <button type="submit" class="btn btn-primary btn-block">Đăng nhập</button>
    </form>
    `
    }

    formSignUpMarkup() {
        return `
    <form class="js-form-signup">
        <h3 class="mb-3">Đăng ký tài khoản</h3>
        <div class="form-group">
            <label for="inputSignupEmail">Email</label>
            <input type="text" class="form-control" id="inputSignupEmail"
                aria-describedby="inputSignupEmailHelp" placeholder="Địa chỉ email..."
                autocomplete="off">
            <div class="invalid-feedback">
                Trường này phải nhập một email.
            </div>
        </div>
        <div class="form-group">
            <label for="inputSignupName">Họ và Tên</label>
            <input type="text" class="form-control" id="inputSignupName"
                aria-describedby="inputSignupNameHelp" placeholder="Họ và tên của bạn..."
                autocomplete="off">
            <div class="invalid-feedback">
                Trường này nhập ít nhất 4 ký tự, tối đa 30 kí tự.
            </div>
        </div>
        <div class="form-group">
            <label for="inputSignupPassWord">Mật khẩu</label>
            <input type="password" class="form-control" id="inputSignupPassWord"
                placeholder="Mật khẩu..." autocomplete="off">
            <div class="invalid-feedback">
                Mật khẩu nhập ít nhất 6 ký tự.
            </div>
        </div>
        <div class="form-group">
            <label for="inputSignupPassWordConfirm">Xác nhận mật khẩu</label>
            <input type="password" class="form-control" id="inputSignupPassWordConfirm"
                placeholder="Xác nhận mật khẩu..." autocomplete="off">
            <div class="invalid-feedback">
                Mật khẩu không trùng khớp.
            </div>
        </div>

        <button type="submit" class="btn btn-primary btn-block">Đăng ký</button>
    </form>
    `
    }

    loginClickMarkup() {
        return `
    <li class="nav-item mr-5">
        <a class="nav-link js-login" href="#">Đăng nhập</a>
    </li>
    `
    }

    userDisplayMarkup(user) {
        const linkAdminPage = (user.role === "admin" || user.role === "superadmin") ? `<a class="dropdown-item js-user-admin-page" href="#admin123123123">Trang Admin</a>` : ''
        return `
    <li class="nav-item dropdown mr-5">
        <a class="nav-link dropdown-toggle text-light mr-5" href="#" id="navbarDropdown" role="button"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            ${user.name}
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item js-user-info" href="#">Trang cá nhân</a>
            <a class="dropdown-item js-user-history-play" href="#">Lịch sử chơi</a>
            <a class="dropdown-item js-user-vocab" href="#">Quản lý từ vựng</a>
            ${linkAdminPage}
            <div class="dropdown-divider"></div>
            <a class="dropdown-item js-logout" href="#">Đăng xuất</a>
        </div>
    </li>
    `
    }

}

export default new AuthMarkup()