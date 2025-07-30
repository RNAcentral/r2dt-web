export async function onSubmit(ebiServer, sequence) {
    const body = `email=rnacentral%40gmail.com&sequence=${sequence}&template_id=`;
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
        const jobId = await response.text();
        return await fetchStatus(ebiServer, jobId);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchStatus(ebiServer, jobId) {
    try {
        const response = await fetch(`${ebiServer}/status/${jobId}`, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain',
            },
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.text();

        if (data === 'RUNNING' || data === 'QUEUED') {
            await new Promise(r => setTimeout(r, 2000));
            return await fetchStatus(ebiServer, jobId);
        } else if (data === 'FINISHED') {
            const [fastaData, svgData] = await Promise.all([
                getFasta(ebiServer, jobId),
                getSvg(ebiServer, jobId)
            ]);
            return { fasta: fastaData, jobId: jobId, svg: svgData };
        } else if (data === 'NOT_FOUND') {
             return 'NOT_FOUND';
        } else if (data === 'FAILURE') {
            return 'FAILURE';
        } else if (data === 'ERROR') {
            return 'ERROR';
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getSvg(ebiServer, jobId) {
    try {
        const response = await fetch(`${ebiServer}/result/${jobId}/svg`, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain',
            },
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.text();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getFasta(ebiServer, jobId) {
    try {
        const response = await fetch(`${ebiServer}/result/${jobId}/fasta`, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain',
            },
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.text();
        const lines = (data.match(/[^\r\n]+/g)) || [];
        return lines[2] || '';
    } catch (error) {
        console.error(error);
        throw error;
    }
}
