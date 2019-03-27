const form = document.querySelector('form');

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const address = document.querySelector('input').value.trim();
    let el = document.getElementById('msg');
    setMessage(el, 'loading...')
    fetch(`/weather?address=${address}`).then((res)=>{
        res.json().then((data)=>{
            data.error ? 
            setMessage(el, data.error, 'error') :
            setMessage(el, data.forecast);
        })
    })
})

function setMessage(el, msg, className=''){
    el.textContent = msg;
    className ? el.classList = [className] : el.classList = [];
}