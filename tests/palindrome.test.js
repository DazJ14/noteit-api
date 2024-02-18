const { palindrome } = require('../utils/for_testing')

test.skip('palindrome of diego', () => {
    const result = palindrome('diego')

    expect(result).toBe('ogeid')
})

test.skip('palindrome of empty string', () => {
    const result = palindrome('')

    expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
    const result = palindrome()

    expect(result).toBeUndefined()
})