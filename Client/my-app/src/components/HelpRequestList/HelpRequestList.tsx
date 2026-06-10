import { useEffect, useState, type FC } from 'react';
import './HelpRequestList.scss';
import api from '../../api';
import type { HelpRequest } from '../../models/helpRequest.model';
import HelpRequestCard from '../HelpRequestCard/HelpRequestCard';


interface HelpRequestListProps {}

const HelpRequestList: FC<HelpRequestListProps> = () => {
const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([])

    useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/helpRequest')
      setHelpRequests(response.data as HelpRequest[])
    }
    fetchData()
  }, [])

return(
<div className="HelpRequestList">
  <ul>
    {helpRequests.map(r => <HelpRequestCard request={r} />)}</ul>
  </div>)
}

export default HelpRequestList;
