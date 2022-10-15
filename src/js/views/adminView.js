

class AdminMarkup {
    adminPageInitMarkup() {
        return `
        <div class="row">
            <nav class="col-md-2 d-none d-md-block bg-transparent sidebar border js-sidebar">
                <div class="sidebar-sticky">
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link text-primary mt-2" href="#">Customers</a>  
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-dark mt-2" href="#">Games</a>  
                        </li>
                    </ul>
            </nav>
            <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4 bg-light js-main-admin">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Dashboard</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                    <div class="btn-group mr-2">
                        <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
                        <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        This week
                    </button>
                    </div>
                </div>

                <h2>Customers</h2>
                <div class="table-responsive">
                    <table class="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>12345678910</td>
                            <td>sangank@gmail.com</td>
                            <td>Hoàng Trung Sang</td>
                            <td>online</td>
                            <td>Chi tiết</td>
                        </tr>
                        <tr>
                            <td>12345678910</td>
                            <td>sangank@gmail.com</td>
                            <td>Hoàng Trung Sang</td>
                            <td>offline 1 minute ago</td>
                            <td>Chi tiết</td>
                        </tr>
                        <tr>
                            <td>12345678910</td>
                            <td>sangank@gmail.com</td>
                            <td>Hoàng Trung Sang</td>
                            <td>offline 3minutes ago</td>
                            <td>Chi tiết</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                </main>
            </div>
    `
    }
}

export default new AdminMarkup()