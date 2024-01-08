function palindrome(str) {
    let normalized = str.replace(/[^A-Za-z0-9]/g,'').toLowerCase()
    let reversed = [...normalized].reverse().join('')
    console.log(normalized)
    
    return normalized == reversed
    }
    
    console.log(palindrome("five|\_/|four"))