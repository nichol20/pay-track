const SERVER_URL = Cypress.env("SERVER_URL")

describe("App", () => {
    const mockUser = {
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '123.456.789-00',
        phone: '555-5555',
        password: "johndoe123"
    }


    it("should be redirected to login page", () => {
        cy.intercept("GET", `${SERVER_URL}/**`, {
            statusCode: 401
        }).as("preload")

        cy.visit("/")

        cy.wait("@preload")

        cy.on('uncaught:exception', err => {
            if (err.message.includes("NEXT_REDIRECT")) {
                return false
            }
        })

        cy.assertPath('/login')
    })

    it("should go to sign up page", () => {
        cy.visit("/login")

        cy.get('a[href="/signup"]').click()

        cy.assertPath("/signup")
        cy.get('h2').contains(/adicione seus dados/i)
    })

    it("should register successfully", () => {
        cy.intercept("POST", `${SERVER_URL}/signup`, {
            statusCode: 200
        }).as("register")

        cy.visit('/signup')

        cy.get('#name').type(mockUser.name)
        cy.get('#email').type(mockUser.email)

        cy.get('button').contains(/continuar/i).click()

        // check if the style is being applied
        cy.getByClass('instructionStep').eq(0).invoke('attr', 'class').should('match', /done/i)
        cy.getByClass('instructionStep').eq(1).invoke('attr', 'class').should('match', /current/i)

        cy.get('#password').type(mockUser.password)
        cy.get('#confirmationPassword').type(mockUser.password)

        // check the show password button
        cy.get('#password').siblings('button').click()
        cy.get('#password').should('have.attr', 'type', 'text')

        // check the previous step button
        cy.get('button').contains(/voltar/i).click()
        cy.get('#name').should('be.visible')

        cy.get('button').contains(/continuar/i).click()
        cy.get('button').contains(/enviar/i).click()

        cy.get('a[href="/login"]').click()
        cy.assertPath('/login')
    })

    it("should login successfully", () => {
        cy.intercept("POST", `${SERVER_URL}/login`, {
            statusCode: 200,
            fixture: "users/login"
        }).as("login")

        cy.intercept("GET", `${SERVER_URL}/userDetails/*`, {
            statusCode: 401,
        }).as("userDetails")

        cy.on('uncaught:exception', err => {
            if (err.message.includes("NEXT_REDIRECT")) {
                return false
            }
        })

        cy.visit("/login")

        cy.get('#email').type(mockUser.email)
        cy.get('#password').type(mockUser.password)

        cy.get('button').contains(/entrar/i).click()

        cy.wait(["@login", "@userDetails"])

        cy.assertPath('/')
        cy.get('h1').contains(/resumo das cobranças/i).should("exist")
    })

    it("should show charges and clients correctly", () => {
        cy.intercept("GET", `${SERVER_URL}/userDetails/*`, {
            statusCode: 200,
            fixture: "users/details.json"
        }).as("userDetails")

        cy.intercept("GET", `${SERVER_URL}/dashboardCharges`, {
            statusCode: 200,
            fixture: "charges/dashboard.json"
        }).as("chargesDashboard")

        cy.intercept("GET", `${SERVER_URL}/dashboardClients`, {
            statusCode: 200,
            fixture: "clients/dashboard.json"
        }).as("clientsDashboard")

        cy.visit("/")

        cy.wait(["@userDetails", "@chargesDashboard", "@clientsDashboard"])

        cy.getByClass("chargeRow").should('exist')
        cy.getByClass("clientRow").should('exist')
    })

    it("should navigate to clients page and show clients correctly", () => {
        cy.intercept("GET", `${SERVER_URL}/**`, {
            statusCode: 400,
        }).as("preload")

        cy.intercept("GET", `${SERVER_URL}/userDetails/*`, {
            statusCode: 200,
            fixture: "users/details.json"
        }).as("userDetails")

        cy.intercept("GET", `${SERVER_URL}/consultClient`, {
            statusCode: 200,
            fixture: "clients/consult.json"
        }).as("consult")

        cy.visit("/")

        cy.wait(["@preload", "@userDetails"])

        cy.getByClass("navigationMenu").children('a[href="/clients"]').click()

        cy.wait("@consult")

        cy.assertPath("/clients")
        cy.get('h1').contains(/clientes/i).should('exist')

        cy.getByClass("clientRow").should('have.length.greaterThan', 3)
    })

    it("should search for clients properly", () => {
        cy.intercept("GET", `${SERVER_URL}/userDetails/*`, {
            statusCode: 200,
            fixture: "users/details.json"
        }).as("userDetails")

        cy.intercept("GET", `${SERVER_URL}/consultClient`, {
            statusCode: 200,
            fixture: "clients/consult.json"
        }).as("consultClient")

        cy.intercept("GET", `${SERVER_URL}/searchClients*`, {
            statusCode: 200,
            fixture: "clients/search.json"
        }).as("search")

        cy.visit('/clients')

        cy.wait(['@userDetails', '@consultClient'])

        // check initial state
        cy.getByTestId("clientRows").children("div").should('have.length.greaterThan', 3)

        // search and test
        cy.getByClass('searchInput').children('input').type("search test")
        cy.wait("@search")
        cy.getByTestId("clientRows").children("div").should('have.length.lte', 2)

        // clean search input
        cy.getByClass('searchInput').children('button[class*=cleanBtn]').click()
        cy.getByClass('searchInput').children('input').should('contain.value', '')
        cy.getByTestId("clientRows").children("div").should('have.length.greaterThan', 3)
    })

    it("should navigate to charges and show charges correctly", () => {
        cy.intercept("GET", `${SERVER_URL}/**`, {
            statusCode: 400,
        }).as("preload")

        cy.intercept("GET", `${SERVER_URL}/userDetails/*`, {
            statusCode: 200,
            fixture: "users/details.json"
        }).as("userDetails")

        cy.intercept("GET", `${SERVER_URL}/allCharges`, {
            statusCode: 200,
            fixture: "charges/list.json"
        }).as("charges")

        cy.visit("/")
        cy.wait(["@preload", "@userDetails"])

        cy.getByClass("navigationMenu").children('a[href="/charges"]').click()
        cy.wait(["@charges"])
        cy.assertPath("/charges")

        cy.getByClass("chargeRow").should('exist')
    })

    it("should search for charges properly", () => {
        cy.intercept("GET", `${SERVER_URL}/userDetails/*`, {
            statusCode: 200,
            fixture: "users/details.json"
        }).as("userDetails")

        cy.intercept("GET", `${SERVER_URL}/allCharges`, {
            statusCode: 200,
            fixture: "charges/list.json"
        }).as("charges")

        cy.intercept("GET", `${SERVER_URL}/searchCharges*`, {
            statusCode: 200,
            fixture: "charges/search.json"
        }).as("search")

        cy.visit('/charges')
        cy.wait(['@userDetails', '@charges'])

        // check initial state
        cy.getByTestId("chargeRows").children("div").should('have.length.gte', 4)

        // search and test
        cy.getByClass('searchInput').children('input').type("search test")
        cy.wait("@search")
        cy.getByTestId("chargeRows").children("div").should('have.length.lte', 2)

        // clean search input
        cy.getByClass('searchInput').children('button[class*=cleanBtn]').click()
        cy.wait("@search")
        cy.getByClass('searchInput').children('input').should('contain.value', '')
        cy.getByTestId("chargeRows").children("div").should('have.length.gte', 4)
    })

    it("should be able to navigate to client page", () => {
        cy.intercept("GET", `${SERVER_URL}/userDetails/*`, {
            statusCode: 200,
            fixture: "users/details.json"
        }).as("userDetails")

        cy.intercept("GET", `${SERVER_URL}/allCharges`, {
            statusCode: 200,
            fixture: "charges/list.json"
        }).as("charges")

        cy.intercept("GET", `${SERVER_URL}/consultClient`, {
            statusCode: 200,
            fixture: "clients/consult.json"
        }).as("consultClient")

        cy.intercept("GET", `${SERVER_URL}/clientDetails/*`, {
            statusCode: 200,
            fixture: "clients/details.json"
        }).as("clientDetails")


        // test from charges page
        cy.visit('/charges')
        cy.wait(['@userDetails', '@charges'])

        cy.getByTestId("clientLink").first().click()
        cy.wait("@clientDetails")

        cy.getByClass("chargeRow").should('exist')
        cy.get('h1').contains(/test/i).should('exist')

        // test from clients page
        cy.visit('/clients')
        cy.wait('@consultClient')

        cy.getByTestId("clientLink").first().click()
        cy.wait("@clientDetails")

        cy.getByClass("chargeRow").should('exist')
        cy.get('h1').contains(/test/i).should('exist')
    })

    it("should logout properly", () => {
        cy.intercept("GET", `${SERVER_URL}/**`, {
            statusCode: 400,
        }).as("preload")

        cy.intercept("GET", `${SERVER_URL}/userDetails/*`, {
            statusCode: 200,
            fixture: "users/details.json"
        }).as("userDetails")

        cy.on('uncaught:exception', err => {
            if (err.message.includes("NEXT_REDIRECT")) {
                return false
            }
        })

        cy.visit("/")
        cy.wait(["@preload", "@userDetails"])

        cy.getByTestId('showOptionsBtn').click()
        cy.get('button').contains(/sair/i).click()

        cy.assertPath("/login")
    })
})