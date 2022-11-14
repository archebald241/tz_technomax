$(document).ready(() => {
    $("#products").hide()

    function checkValidPhone(phone) {
        const regtest = /^[\d\+]{1,12}$/
        if (regtest.test(phone)) {
            const regex = /(\+?)(\d{1}?)(\d{3})(\d{3})(\d{2})(\d{2})/g;
            const subst = "$3$4$5$6";
            return "7" + phone.replace(regex, subst);
        } else {
            return "Неправильно набран номер"
        }
    }

    function authCallback(auth_data) {
        if (typeof auth_data !== "string") {
            $("#products").show()
            $("#auth").hide()
            $("header").append(`
                <div class="username">
                    Привет, ${auth_data.user_name}
                </div>
            `)
        } else {
            alert(auth_data)
        }
    }

    function fetchAuth(phone, callback) {
        $.ajax({
            url: `https://my-json-server.typicode.com/archebald241/tz_technomax/users?user_phone=${phone}`,
            type: 'GET',
            success: function (data) {
                if (data.length > 0) {
                    callback(data[0])
                } else {
                    callback("Такого номера нет в базе")
                }
            },
            error: function () {
                callback("Ошибка подключения к серверу")
            }
        });
    }

    function createProductHtmlElements(img_src, name, price, category, count) {
        let product_card = `
            <div class="product-card">
                <div class="product-card__title">
                    <img src="${img_src}" alt="product preview">
                </div>
                <div class="product-card__body">
                    <div class="product-card__body__name">
                        <a href="#">${name}</a>
                    </div>
                    <div class="product-card__body__price">
                        Цена: ${price} р.
                    </div>
                </div>
            </div>
        `

        let category_item = `
            <li class="catecories-list__item"><a href="#">
                ${category} <span class="catecories-list__item__count">(${count})</span>
            </a></li>
        `

        return [product_card, category_item]
    }

    function productsCallback(data) {
        $('#catecories-list').html('');
        $('#products-list').html('');

        let catecories_list = []

        if (data.length === 0) {
            $('#products-list').append(`
                <div class="not-found">Ничего не найдено</div>
            `)
        } else {
            for (const item of data) {
                const [product_card, category_item] = createProductHtmlElements(
                    item.image,
                    item.name,
                    item.price,
                    item.category,
                    data.filter(i => i.category === item.category).length
                )

                if (!catecories_list.includes(item.category)) {
                    catecories_list.push(item.category)
                    $('#catecories-list').append(category_item)
                }

                $('#products-list').append(product_card)
            }
        }
    }

    function fetchProducts(name) {
        $.ajax({
            url: `https://my-json-server.typicode.com/archebald241/tz_technomax/products?name_like=${name}`,
            type: 'GET',
            success: function (data) {
                productsCallback(data)
            },
            error: function () {
                console.log("Произошла ошибка при загрузке товаров");
            }
        });
    }

    $('#search-form').submit(function (event) {
        event.preventDefault()
        const product_name = event.target.product_name.value

        fetchProducts(product_name)
    });

    $("#auth-form").submit(function (event) {
        event.preventDefault()
        const phone = event.target.phone.value

        event.target.phone.value = ""

        const validPhone = checkValidPhone(phone)

        if (validPhone[0] === "7") {
            fetchAuth(validPhone, authCallback)
        } else {
            alert(validPhone)
        }
    })

    fetchProducts("")
})