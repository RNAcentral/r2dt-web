
export async function onSubmit(ebiServer, sequence) {
    const body = `email=rnacentral%40gmail.com&sequence=${sequence}&template_id=""&constraint=false`;
    try {
        const response = await fetch(`${ebiServer}/run`, {
            method: 'POST',
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body,
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        this.jobId = await response.text();
        console.log(this.jobId);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
