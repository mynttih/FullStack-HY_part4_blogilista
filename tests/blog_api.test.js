const { app, server } = require('../index')
const Blog = require('../models/blog')
const supertest = require('supertest')

const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2
    }  
]

const newBlog = {
    title: "Joel on Software",
    author: "Joel Spolsky",
    url: "https://www.joelonsoftware.com/",
    likes: 5
}

const newBlogLikesUndefined = {
    title: "Joel on Software",
    author: "Joel Spolsky",
    url: "https://www.joelonsoftware.com/"
}

const newBlogTitleUndefined = {
    author: "Joel Spolsky",
    url: "https://www.joelonsoftware.com/"
}

const api = supertest(app)

beforeAll(async () => {
    await Blog.remove()

    const blogObjects = initialBlogs.map(blog => Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('blog_api', () => {
    test('notes are returned as json', async () => {
        const res = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const res = await api
            .get('/api/blogs')
        
        expect(res.body.length).toBe(initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const res = await api
            .get('/api/blogs')

        const titles = res.body.map(blog => blog.title)

        expect(titles).toContain('TDD harms architecture')
    })

    test('a valid blog can be added', async () => {
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const res = await api
            .get('/api/blogs')

        const titles = res.body.map(blog => blog.title)

        expect(res.body.length).toBe(initialBlogs.length + 1)
        expect(titles).toContain('Joel on Software')
    })

    test('blog with undefined likes is set to zero', async () => {
        const initializedBlogs = await api
            .get('/api/blogs')

        await api
            .post('/api/blogs')
            .send(newBlogLikesUndefined)
            .expect(201)

        const res = await api
            .get('/api/blogs')

        expect(res.body[res.body.length - 1].likes).toBe(0)
    })

    test('blog with undefined title is rejected', async () => {
        await api
            .post('/api/blogs')
            .send(newBlogTitleUndefined)
            .expect(400)
    })
})

afterAll(() => {
    server.close()
})