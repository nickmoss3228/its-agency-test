export class PaintAPI {
    static baseURL = 'https://687cf19d918b64224330891e.mockapi.io/api/paints'

    static async getAllPaints() {
        try {
            // console.log(`${PaintAPI.baseURL}paints`)
            const response = await fetch(`${this.baseURL}paints`)
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const paints = await response.json();
            return paints;
        } catch {
            console.error('Error fetching paints:', error)
            return [];
        }
    }
}